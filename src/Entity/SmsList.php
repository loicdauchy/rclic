<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Repository\SmsListRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ApiResource()
 * @ORM\Entity(repositoryClass=SmsListRepository::class)
 */
class SmsList
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="datetime")
     */
    private $date;

    /**
     * @ORM\ManyToOne(targetEntity=Users::class, inversedBy="smsLists")
     */
    private $commerce;

    /**
     * @ORM\OneToOne(targetEntity=Appointments::class, cascade={"persist", "remove"})
     * @ORM\JoinColumn(nullable=true, onDelete="SET NULL")
     */
    private $rdv;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $infos;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getCommerce(): ?Users
    {
        return $this->commerce;
    }

    public function setCommerce(?Users $commerce): self
    {
        $this->commerce = $commerce;

        return $this;
    }

    public function getRdv(): ?Appointments
    {
        return $this->rdv;
    }

    public function setRdv(?Appointments $rdv): self
    {
        $this->rdv = $rdv;

        return $this;
    }

    public function getInfos(): ?string
    {
        return $this->infos;
    }

    public function setInfos(string $infos): self
    {
        $this->infos = $infos;

        return $this;
    }
}
